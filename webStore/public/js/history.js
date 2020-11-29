const UICtrl = (()=>{
    const UISelectors = {
        mainContainer:".main-container",
        userOrder:".user-order-wrapper",
    }

    return{
        UISelectors:UISelectors,
    }
})();

const App = ((UICtrl)=>{

    function loadEventListeneres(){
        const UISelectors = UICtrl.UISelectors;

        //*@desc Sending user id to the server
        //*      and delete user order on click event
        document.querySelector(UISelectors.mainContainer).addEventListener('click', (e) =>{
            if(e.target.className.includes("delete-order")){
                const orderNumber = e.target.classList[1];
                const orderElement = document.querySelector(`${UISelectors.userOrder}.${orderNumber}`);
                const id = orderElement.id;
                orderElement.remove();

                fetch("/deleteOrder", {
                    method:'POST',
                    headers:{
                        'Accept':'application/json',
                        'Content-Type':'application/json'  
                    },
                    body:JSON.stringify({
                        id:id
                    })
                })
            }
        })
    }

    return{
        init:() =>{
            loadEventListeneres();
        }
    }
})(UICtrl);


App.init();