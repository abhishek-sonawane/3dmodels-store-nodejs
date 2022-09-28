let body = document.body
const mytimeout = setTimeout(run , 1000)

function run(){
    body.classList.add('.loader-body')
}