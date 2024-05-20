export interface Metadata {
  /**
   * Specifies the name of the script as it appears in the Script Kit interface.
   */
  name: string

  /**
   * Provides a brief description of the script's functionality.
   */
  description?: string

  /**
   * Defines a global keyboard shortcut to trigger the script.
   */
  shortcut?: string

  /**
   * Designates the script as a text expansion snippet and specifies the trigger text.
   */
  snippet?: string

  /**
   * Associates a keyword with the script for easier discovery in the main menu.
   */
  keyword?: string

  /**
   * Indicates that user input in the main menu should be passed as an argument to the script.
   */
  pass?: boolean

  /**
   * Assigns the script to a specific group for organization in the main menu.
   */
  group?: string

  /**
   * Excludes the script from appearing in the main menu.
   */
  exclude?: boolean

  /**
   * Specifies a file or directory to watch for changes, triggering the script upon modifications.
   */
  watch?: string

  /**
   * Designates the script as a background process, running continuously in the background.
   */
  background?: boolean

  /**
   * Associates the script with system events such as sleep, wake, or shutdown.
   */
  system?: string

  /**
   * Specifies a cron expression for scheduling the script to run at specific times or intervals.
   */
  schedule?: string
}
