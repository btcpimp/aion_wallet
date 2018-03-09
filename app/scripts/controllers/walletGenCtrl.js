'use strict';
var walletGenCtrl = function($scope) {
    $scope.password = "";
    $scope.retypePassword = "";
    $scope.wallet = null;
    $scope.showWallet = false;
    $scope.blob = $scope.blobEnc = "";
    $scope.isDone = true;
    $scope.showPass = true;
    $scope.fileDownloaded = false;
    $scope.showPaperWallet = false;
    $scope.showGetAddress = false;
    $scope.genNewWallet = function() { 
        if (!$scope.isStrongPass() ) {
            $scope.notifier.danger(globalFuncs.errorMsgs[1]);
        }else if (!$scope.isRetypeMatch()){
            $scope.notifier.danger(globalFuncs.errorMsgs[40]);
        }
         else if ($scope.isDone) {
            $scope.wallet = $scope.blob = $scope.blobEnc = null;
            if (!$scope.$$phase) $scope.$apply();
            $scope.isDone = false;
            $scope.wallet = Wallet.generate(false);
            $scope.showWallet = true;console.log($scope.wallet.toJSON());
            //$scope.blob = globalFuncs.getBlob("text/json;charset=UTF-8", $scope.wallet.toJSON());

            var encodedFile = $scope.wallet.toV3($scope.password, {
                kdf: globalFuncs.kdf,
                n: globalFuncs.scrypt.n
            });
            console.log(encodedFile)

            $scope.blobEnc = globalFuncs.getBlob("application/octet-stream", encodedFile);

            $scope.encFileName = $scope.wallet.getV3Filename();
            if (parent != null)
                parent.postMessage(JSON.stringify({ address: $scope.wallet.getAddressString(), checksumAddress: $scope.wallet.getChecksumAddressString() }), "*");
            $scope.isDone = true;
            if (!$scope.$$phase) $scope.$apply();
        }
    }
    $scope.printQRCode = function() {        
        var pub = $scope.wallet.getPublicKeyString();
        var priv = $scope.wallet.getPrivateKeyString();

        globalFuncs.printPaperWallets(JSON.stringify([{
            address: '0x'+Buffer(pub,'hex').toString('hex'),
            private: '0x'+priv.substring(0,64)+'\n'+priv.substring(64,128)
        }]));
    }
    $scope.isStrongPass = function() {
        return globalFuncs.isStrongPass($scope.password);
    }
    $scope.isRetypeMatch = function() {
        return globalFuncs.isRetypeMatch($scope.password, $scope.retypePassword);
    }
    $scope.downloaded = function() {
        $scope.fileDownloaded = true;
    }
    $scope.continueToPaper = function() {
        $scope.showPaperWallet = true;
    }
    $scope.getAddress = function(){
        $scope.showPaperWallet = false;
        $scope.wallet = null;
        $scope.showGetAddress = true;
    }
};
module.exports = walletGenCtrl;