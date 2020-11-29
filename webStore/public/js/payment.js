const UICtrl = (()=>{
    const UISelectors = {
        orderButton:".button-order",
        paymentContainer:".fake-payment-container",
        paymentWrapper:".fake-payment-wrapper",
        payNowButton:".pay-now",
        continueButton:".continue",
        orderId:".order-id",
        loader:".loader",
        successMessage:".success-message",
    }

    return{
        UISelectors:UISelectors,
    }

})();


const App = ((UICtrl)=>{

    function loadEventListeners(){

        const UISelectors = UICtrl.UISelectors;

        //*@desc Show payment form on ORDER button click
        document.querySelector(UISelectors.orderButton).addEventListener("click", (e)=>{
            document.querySelector(UISelectors.paymentContainer).classList.add("show-payment");
        });

        //*@desc Remove payment form when user clicked outside of the form body
        document.addEventListener("click", (e) =>{
            const paymentContainer = document.querySelector(UISelectors.paymentContainer);
            if(e.target == paymentContainer){
                paymentContainer.classList.remove("show-payment");
            }
        });

        //*@desc 1) Send user input to the server
        //*      2) Create a fake payment loading
        //*      3) Show success alert and remove order from page
        document.querySelector(UISelectors.payNowButton).addEventListener("click", (e) =>{
            e.preventDefault();
            const id = document.querySelector(UISelectors.orderId).value;

            setTimeout(() => {
                document.querySelector(UISelectors.loader).classList.remove("show-loader");
                document.querySelector(".order-wrapper").style.display = 'none';
                document.querySelector(UISelectors.paymentContainer).classList.remove("show-payment");
                document.querySelector(UISelectors.successMessage).classList.add("show-success-message");
            }, 2000);

            document.querySelector(UISelectors.loader).classList.add("show-loader");

            fetch("/payment", {
                method:'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    id:id
                })
            }) 
        });

        
        //*@desc Close suceess message on click
        document.querySelector(UISelectors.continueButton).addEventListener("click", (e)=>{
            document.querySelector(".success-message").classList.remove("show-success-message");
        })


    }

    return{
        init:()=>{
            loadEventListeners();
        }
    } 
    
})(UICtrl)


App.init();