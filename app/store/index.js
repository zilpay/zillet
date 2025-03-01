import Vuex from 'vuex';

import * as actions from '@/store/actions';
import * as mutations from '@/store/mutations';
import * as getters from '@/store/getters';
import config from '@/config';
const createStore = () =>
  new Vuex.Store({
    state: {
      loading: false,
      nodes: config.NODES,
      selectedNode: config.NODES[0],
      selectedAccount: 'Account 1',
      wallet: {
        address: '',
        privateKey: '',
        publicKey: '',
        balance: '',
        nonce: ''
      },
      errorMsg: '',
      encryptedWallets: [],
      prices: {},
      viewblockAccount: {
        txs: {
          docs: []
        }
      },
      localTxns: [],
      accessType: ''
    },
    actions,
    mutations,
    getters,
    strict: false,
    preserveState: true
  });

export default createStore;
