cc.Class({
    extends: cc.Component,

    properties: {
        rotateSpeed: 0
    },

    // use this for initialization
    onLoad: function () {
        this.init();
    },
    
    init () {
        this.rotateSpeed = 10;
        this.await()
    },

    
    await () {
        //待机旋转  
         var seq = cc.repeatForever(
             cc.sequence(
                 cc.rotateTo(2, -70), 
                 cc.rotateTo(2, 70)
             ));
        this.node.runAction(seq)
    },



});
