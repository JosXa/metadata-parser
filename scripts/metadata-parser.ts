// Name: Typed Metadata Parser

import "@johnlindquist/kit"
import { getAllScriptPaths } from "@josxa/kit-utils"
import { Parser, type Program } from "acorn"
import tsPlugin from "acorn-typescript"
import BPromise from "bluebird"
import type { Metadata } from "../../../../.kit"

export const metadata: Metadata = {
  name: "Typed Metadata Parser",
  description: "Reads metadata from the exported `metadata` constant and updates the comment-based values",
}

const allScriptPaths = await getAllScriptPaths()

const results = await BPromise.props(Object.fromEntries(allScriptPaths.map((path) => [path, tryExtractMetadata(path)])))

await Promise.all(
  Object.entries(results).map(([filePath, metadataOrErrorComment]) => {
    if (typeof metadataOrErrorComment === "string") {
      return writeErrorToFile(filePath, metadataOrErrorComment)
    }
    if (Object.keys(metadataOrErrorComment).length === 0) {
      return
    }
    return writeMetadataToFile(filePath, metadataOrErrorComment)
  }),
)

const parseTypeScript = (code: string) => {
  //@ts-expect-error Dunno...
  const parser = Parser.extend(tsPlugin())
  return parser.parse(code, { sourceType: "module", ecmaVersion: "latest" })
}

async function extractMetadata(ast: Program) {
  for (const node of ast.body) {
    if (node.type !== "ExportNamedDeclaration" || !node.declaration) {
      continue
    }

    const declaration = node.declaration

    if (declaration.type !== "VariableDeclaration" || !declaration.declarations[0]) {
      continue
    }

    const namedExport = declaration.declarations[0]

    if (!("name" in namedExport.id) || namedExport.id.name !== "metadata") {
      continue
    }

    if (namedExport.init?.type !== "ObjectExpression") {
      continue
    }

    const properties = namedExport.init?.properties

    return properties.reduce((acc, prop) => {
      if (!isOfType(prop, "Property")) {
        throw Error("Not a Property")
      }

      const key = prop.key
      const value = prop.value

      if (!isOfType(key, "Identifier")) {
        throw Error("Key is not an Identifier")
      }

      if (!isOfType(value, "Literal")) {
        throw Error(`value is not a Literal, but a ${value.type}`)
      }

      acc[key.name] = value.value
      return acc
    }, {})
  }

  // Nothing found
  return {}
}

function isOfType<T extends { type: string }, TType extends string>(node: T, type: TType): node is T & { type: TType } {
  return node.type === type
}

async function tryExtractMetadata(filePath: string): Promise<object | string> {
  const fileContents = await readFile(filePath, { encoding: "utf-8" })

  let ast: Program
  try {
    ast = parseTypeScript(fileContents)
  } catch (err) {
    return {} // Nothing we can do if the file doesn't parse
  }

  try {
    return await extractMetadata(ast)
  } catch (err) {
    console.error(`Unable to extract metadata for file '${path.basename(filePath)}': ${err}`)
    return `/* Unable to extract metadata: ${(err as Error).message.replaceAll("*/", "")} */`
  }
}

async function writeMetadataToFile(filePath: string, metadata: { [key: string]: any }) {
  const contents = await readFile(filePath, { encoding: "utf-8" })

  const keysToRemove = Object.keys(metadata)

  const scriptWithoutMeta = eraseExistingMetadata(contents, keysToRemove).trim()

  const newMetadata = Object.entries(metadata)
    .map(([key, value]) => `// ${titleCase(key)}: ${value}`)
    .join("\n")

  const newFile = `${newMetadata}\n\n${scriptWithoutMeta}\n`

  await writeFile(filePath, newFile, { encoding: "utf-8" })
}

async function writeErrorToFile(filePath: string, error: string) {
  const contents = await readFile(filePath, { encoding: "utf-8" })
  const newFile = `${error}\n${contents}\n`
  await writeFile(filePath, newFile, { encoding: "utf-8" })
}

function eraseExistingMetadata(contents: string, keysToRemove: string[]): string {
  const lowercasedKeysToRemove = keysToRemove.map((x) => x.toLowerCase())
  let result = contents
  const lines = contents.split("\n")
  let commentStyle: string | null = null
  let spaceRegex: RegExp | null = null
  let inMultilineComment = false
  let multilineCommentEnd: string | null = null

  const setCommentStyle = (style: string) => {
    commentStyle = style
    spaceRegex = new RegExp(`^${commentStyle} ?[^ ]`)
  }

  for (const line of lines) {
    // Check for the start of a multiline comment block
    if (
      !inMultilineComment &&
      (line.trim().startsWith("/*") ||
        line.trim().startsWith("'''") ||
        line.trim().startsWith('"""') ||
        line.trim().match(/^: '/))
    ) {
      inMultilineComment = true
      multilineCommentEnd = line.trim().startsWith("/*")
        ? "*/"
        : line.trim().startsWith(": '")
          ? "'"
          : line.trim().startsWith("'''")
            ? "'''"
            : '"""'
    }

    // Check for the end of a multiline comment block
    if (inMultilineComment && line.trim().endsWith(multilineCommentEnd!)) {
      inMultilineComment = false
      multilineCommentEnd = null
      continue // Skip the end line of a multiline comment block
    }

    // Skip lines that are part of a multiline comment block
    if (inMultilineComment) {
      continue
    }

    // Determine the comment style based on the first encountered comment line
    if (commentStyle === null) {
      if (line.startsWith("//") && (line[2] === " " || /[a-zA-Z]/.test(line[2]!))) {
        setCommentStyle("//")
      } else if (line.startsWith("#") && (line[1] === " " || /[a-zA-Z]/.test(line[1]!))) {
        setCommentStyle("#")
      }
    }

    // Skip lines that don't start with the determined comment style
    if (commentStyle === null || (commentStyle && !line.startsWith(commentStyle))) {
      continue
    }

    // Check for 0 or 1 space after the comment style
    if (!line.match(spaceRegex!)) {
      continue
    }

    // Find the index of the first colon
    const colonIndex = line.indexOf(":")
    if (colonIndex === -1) {
      continue
    }

    // Extract key and value based on the colon index
    const key = line.substring((commentStyle as string).length, colonIndex).trim()

    debugger

    // Ensure the key is a single word
    if (key.includes(" ")) {
      continue
    }

    if (!lowercasedKeysToRemove.includes(key.toLowerCase())) {
      continue
    }

    // Skip empty keys
    if (!key) {
      continue
    }

    result = result.replace(`${line}\n`, "")
  }

  return result
}

function titleCase(val: string) {
  return val.length >= 2 ? `${val[0]!.toUpperCase()}${val.slice(1)}` : val
}
