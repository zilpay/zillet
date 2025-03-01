<template>
  <AccessWalletContainer
    :hide-top="permissionNotGranted"
    @exit="$emit('exit')">
    <template v-slot:title>
      Connect to Moonlet
    </template>
    <z-button
      v-if="!permissionNotGranted"
      class="w-full mb-8"
      rounded
      :loading="loadingInstance"
      @click="connect()">
      Connect
    </z-button>
    <p
      v-if="notFound"
      align="left">
      Moonlet extenstion not found. Please check that extenstion is installed or
      download the extension from the link below.
      <z-button
        class="w-full my-4"
        rounded
        type="default"
        size="small">
        <a
          href="https://moonlet.xyz/"
          target="_blank"
          rel="noopener norefrer nofollow">Download Extenstion</a>
      </z-button>
    </p>
    <p
      v-if="permissionNotGranted"
      align="left">
      You did not grant access on this page for Moonlet Wallet.
      You have to let Moonlet Wallet to access this page in order to continue.
      <z-button
        class="w-full my-4"
        rounded>
        Grant permission
      </z-button>
    </p>
  </AccessWalletContainer>
</template>
<script>
import { mapActions, mapMutations } from 'vuex';
import { decryptPrivateKey } from '@zilliqa-js/crypto';
import { fromBech32Address } from '@zilliqa-js/crypto';
import { dapp } from 'dapp-wallet-util';
import config from '@/config';
export default {
  name: 'Keystore',
  props: {
    uid: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      isFile: false,
      loading: false,
      passphrase: '',
      fileName: '',
      encryptedWallet: '',
      notFound: false,
      permissionNotGranted: false,
      loadingInstance: false
    };
  },
  methods: {
    ...mapActions(['selectNode']),
    ...mapMutations(['importAccount', 'saveAccessType']),
    async connect() {
      this.loadingInstance = true;
      try {
        var moonlet = await dapp.getWalletInstance('moonlet');
        this.loadingInstance = false;
        var account = await moonlet.providers.zilliqa.getAccounts();
        if (account && account.length) {
          if (moonlet.providers.zilliqa.currentNetwork === 1) {
            this.selectNode(config.NODES[0]);
          } else if (moonlet.providers.zilliqa.currentNetwork === 333) {
            this.selectNode(config.NODES[1]);
          } else {
            this.selectNode(config.NODES[2]);
          }
          var base16address = fromBech32Address(account[0]);
          this.importAccount({
            address: base16address
          });
          this.saveAccessType(this.uid);
          this.$router.push({
            name: this.$route.query.redirect || 'send'
          });
          return this.$notify({
            message: `Wallet loaded successfully.`,
            type: 'success'
          });
        }
      } catch (instanceError) {
        this.loadingInstance = false;
        console.log(this.loadingInstance);
        switch (instanceError) {
          case 'WALLET_NOT_INSTALLED':
            this.notFound = true;
          case 'USER_DID_NOT_GRANT_PERMISSION':
            this.permissionNotGranted = true;
          default:
            this.$notify({
              message: `There was an error while loading moonlet wallet instance.`,
              type: 'danger'
            });
        }
      }
    }
  }
};
</script>
