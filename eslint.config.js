import pluginCypress from 'eslint-plugin-cypress/flat'
import pluginReact from 'eslint-plugin-react'

export default [
  {
    plugins: {
      react: pluginReact,
      cypress: pluginCypress
    },
    rules: {
      'cypress/unsafe-to-chain-command': 'error'
    }
  }
]