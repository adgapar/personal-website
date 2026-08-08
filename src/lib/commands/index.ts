// Import command files to trigger self-registration (order matters: output before navigate)
import './output'
import './navigate'
import './easter-eggs'

export {
  executeCommand,
  getAllCommands,
  listCommands,
  registerCommand,
  hasCommand,
} from './registry'
