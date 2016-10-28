
import * as listActions from './list';

export function switchToToshocat() {
  return (dispatch) => {    
    dispatch(listActions.removeSyncer());
    dispatch(listActions.switchList('toshocat'));
  }
}