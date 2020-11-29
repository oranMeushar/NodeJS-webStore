const DataCtrl = (()=>{
    async function getOrders(){
        const orders = await fetch("/getOrders");
        const data = await orders.json();
        return data;
    }

    function deleteOrderById(id){
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

    async function updateOrderById(id){
        await fetch("/updateOrder", {
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

    async function getUsers(){
        const result = await fetch("/getUsers");
        const data = await result.json();
        return data;
    }

    async function deleteUserById(url, id){
        fetch(url, {
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                id:id
            })
        })
    }

    return{
        getOrders:getOrders,
        deleteById:deleteOrderById,
        updateById:updateOrderById,
        getUsers:getUsers,
        deleteUserById:deleteUserById,
    }
})()


const UICtrl = (()=>{
    const UISelectors = {
        OrdersButton:".open-orders",
        usersButton:".users-management",
        ordersSubContainer:".open-orders-page-sub-container",
        userMangeWrapper:".user-management-main-wrapper",
        userOrder:".user-order-wrapper",
        ordersPage:".open-orders-page-main-container",
        usersPage:".users-management-page-main-container",
        search:".user-search",
        warnningAlert:".warnning-alert",
        radios:"input[type='radio']",
    }

    function resetOrders(){
        document.querySelector(UISelectors.ordersSubContainer).innerHTML = "";
    }

    function resetUsers(){
        document.querySelector(UISelectors.userMangeWrapper).innerHTML = "";
    }

    function populateOrders(data){
        let elem;
        for (let i = 0; i < data.length; i++) {
            elem = `<div class="user-order-wrapper">
                        <div class="user-order">                          
                            <p class="number">${i+1})</p>         
                            <h2 class="order-header ${data[i].newItem? 'bold' :''}">${data[i].id}</h2>
                            <a href="/orders/${data[i].id}" class="details">Details</a>         
                        </div>
                        <button class = "delete-order">Delete</button>
                    </div>`;
            document.querySelector(UISelectors.ordersSubContainer).insertAdjacentHTML("beforeend", elem);
        }
    }

    function populateUsers(data){
        let elem;
        for (let i = 0; i < data.length; i++) {
            elem = `<div class="user-management-main-content">
                        <h3 class = "col-1">${data[i]._id}</h3>
                        <h3 class = "col-2">${data[i].name}</h3>              
                        <h3 class = "col-3">${data[i].email}</h3>
                        <div class="col-4">
                            <div class="circles-wrapper">
                                <div class="circle circle1"></div>
                                <div class="circle circle2"></div>
                                <div class="circle circle3"></div>
                            </div>
                            <div class="circle-options">
                                <a class = "orders-history" target="_blank" href="/history/${data[i]._id}">Orders History</a>
                                <a class = "send-email" href="https://mailto:${data[i].email}">Send Email</a>
                                <a id =${data[i]._id} class = "delete-user" href="/deleteUser">Remove User</a>
                            </div>
                        </div>
                    </div>`
            document.querySelector(UISelectors.userMangeWrapper).insertAdjacentHTML("beforeend", elem);
        }
    }

    function removeOrder(element){
        element.remove();
    }

    return{
        UISelectors:UISelectors,
        resetData:resetOrders,
        populateOrders:populateOrders,
        removeOrder:removeOrder,
        resetUsers:resetUsers,
        populateUsers:populateUsers,
    }
})();

 
const App = ((UICtrl, DataCtrl)=>{

    let orderInterval;
    let once = 0;
    let usersArray = [];
    let searchMethod = null;
    const UISelectors = UICtrl.UISelectors;

    function loadEventListeners(){
        
        //*desc on button click, get all orders from data base
        document.querySelector(UISelectors.OrdersButton).addEventListener('click', async(e) =>{
            const data = await DataCtrl.getOrders();
            UICtrl.resetData();
            UICtrl.populateOrders(data);
            document.querySelector(UISelectors.ordersPage).classList.add("show-page");
        });

        //*@desc listen to a DELETE button click
        //*and remove order from database
        document.querySelector(UISelectors.ordersSubContainer).addEventListener("click", async(e) =>{
            if(e.target.className.includes("delete-order")){
                //manage delete button
                const id = e.target.previousElementSibling.querySelector(".order-header").innerHTML;
                DataCtrl.deleteById(id);
                UICtrl.removeOrder(e.target.parentElement);
                getOrders(); 
            }
        
            if(e.target.className.includes("details")){
                //manage details button
                const id = e.target.parentElement.querySelector(".order-header").innerHTML;
                await DataCtrl.updateById(id);
                getOrders();
            }
        });

        //*@desc Listen to user input anf filter 
        //* according to user name or user email
        document.querySelector(UISelectors.search).addEventListener('input', (e) =>{
            const result = usersArray.filter((user) => {
                if(searchMethod == "name"){
                    return user.name.includes(e.target.value);
                }
                else{
                    return user.email.includes(e.target.value);
                }
            })

            UICtrl.resetUsers();
            UICtrl.populateUsers(result);
        });


        //*desc listen to a click outside orders page and users page
        //* and close these pagees if click was detected
        //*in addition, add events listeres to radio buttons
        document.body.addEventListener("click", (e)=>{
            const ordersPage = document.querySelector(UISelectors.ordersPage);
            const usersPage = document.querySelector(UISelectors.usersPage);
            const warnningAlert = document.querySelector(UISelectors.warnningAlert);
            const search = document.querySelector(UISelectors.search);

            if(e.target == ordersPage){
                ordersPage.classList.remove("show-page");
            }

            if(e.target == usersPage){
                usersPage.classList.remove("show-page");
                warnningAlert.classList.remove("show-warnning");
                search.value = "";
            }
        })

        const radios = document.querySelectorAll("input[type='radio']");
        radios.forEach(radio => {
            radio.addEventListener('change', (e) =>{
                const search = document.querySelector(UISelectors.search);
                searchMethod = e.target.value;
                search.readOnly = false;
                search.value = "";
            })
        });


        //*@Listen to a click on usersButton and fetch all users from database
        document.querySelector(UISelectors.usersButton).addEventListener("click", async()=>{
            UICtrl.resetUsers();
            const data = await DataCtrl.getUsers();            
            usersArray = [...data];
            UICtrl.populateUsers(data);
            once++;
            document.querySelector(UISelectors.usersPage).classList.add("show-page");
            addEventsToButtons(once);
        })
    }

    //*desc Get all orders from database 
    async function getOrders(){
        const data = await DataCtrl.getOrders();
    
        for (let i = 0; i < data.length; i++) {
            if (data[i].newItem) {
                flashButton();
                break;
            }
            if(i == data.length -1){
                clearInterval(orderInterval);
                document.querySelector(UISelectors.OrdersButton).classList.remove("flash");
            }  
        }
    }

    //*@desc Make the orders button flash in red when there is a new order
    function flashButton(){
        orderInterval = setInterval(() => {
            document.querySelector(UISelectors.OrdersButton).classList.toggle("flash");
        }, 700);
    }


    //*@Add functionality to the 3 doted buttons beside each user
    function addEventsToButtons(once){
        if(once == 1){
            document.querySelector(UISelectors.userMangeWrapper).addEventListener("click", (e1) =>{
    
                //////////check if user clicked on the three-dots button///////
                if(e1.target.classList == "circles-wrapper"){
                    e1.target.parentElement.querySelector(".circle-options").classList.toggle("circle-options-clicked");
                }
                if(e1.target.getAttribute("class").includes("circle circle")){
                    e1.target.parentElement.parentElement.querySelector(".circle-options").classList.toggle("circle-options-clicked");
                }
                //////////////////////////end of check///////////////////
    
                if(e1.target.className == "delete-user"){
                    const warnning = document.querySelector(UISelectors.warnningAlert);
                    warnning.classList.add("show-warnning");
                    e1.preventDefault();
    
                    warnning.addEventListener("click", (e2) =>{
                        if(e2.target.className.includes("confirm")){
                            e1.target.parentElement.parentElement.parentElement.remove();
                            const url = e1.target.href;
                            const id = e1.target.id;
                            DataCtrl.deleteUserById(url, id);
                            warnning.classList.remove("show-warnning");
                        }
                        else if(e2.target.className.includes("cancle")){
                            warnning.classList.remove("show-warnning");
                        }
                    })
                }
            })
        }  
    }
    return{
        init:()=>{
            getOrders();    
            loadEventListeners();
        }
    }

})(UICtrl, DataCtrl)

App.init();
