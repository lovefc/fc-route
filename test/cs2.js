const Eventproxy = require('eventproxy')

let ep = new Eventproxy()

ep.all('action1','action2','action3', (data1,data2,data3) => {
    console.log(data1,data2,data3)
})

let action1 = new Promise((resolve,reject) => {
        resolve('data1')
})

let action2 = new Promise((resolve,reject) => {
        resolve('data2')
})

let action3 = new Promise((resolve,reject) => {
        resolve('data3')
})

action3.then( (data) => {
    ep.emit('action3',data)
})

action1.then( (data) => {
    ep.emit('action1',data)
})

action2.then( (data) => {
    ep.emit('action2',data)
})

