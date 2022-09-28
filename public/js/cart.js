
console.log(id)
var orderbtn = document.querySelector('.order-btn')
var priceElement = document.querySelector('.price')


    
    orderbtn.addEventListener('click',()=>{
        fetch('http://localhost:5000/create-checkout-session',{
            method:'post',
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify({
                id:id,
                quantity:1
            }),
        })
        .then(res=>{
            if (res.ok) return res.json()
            return res.json().then(json=> Promise.reject(json))
        })
        .then(({url})=>{
            // console.log(url)
            window.location= url
        })
        .catch((err)=>{
            console.log(err)
        })
    })