import store from './storeSetup'

export * from './storeSetup'
// auth / base / theme / locale slice actions + state types now come from
// @kozydozy/foundation (the slices are composed via `foundationReducers`).
export * from '@kozydozy/foundation'
export * from './rootReducer'
export * from './hooks'
export default store
