const express = require('express')
const app = express()
const uuid = require('uuid')

const port = 3000
app.use(express.json())

const users = []

const checkUser = (request, response, next) => {
    const { id } = request.params

    const index = users.findIndex(user => user.id === id)

    if(index < 0){
        return response.status(404).json({ error: "User not found"})
    }

    request.userId = id
    request.userIndex = index

    next()
}

const checkMethod = (request, response, next) => {
    const method = request.method

    const url = request.url

    console.log(`${method} - ${url}`)

    next()
}



app.get('/order', checkMethod, (request, response) => {
    return response.json(users)
})

app.post('/order', checkMethod, (request, response) => {
    const { order, clientName, price, status } = request.body

    const user = { id: uuid.v4(), order, clientName, price, status}

    users.push(user)

    return response.status(201).json(user)
})

app.put('/order/:id', checkUser, checkMethod, (request, response) => {
    const id = request.userId
    const { order, clientName, price, status } = request.body

    const updatedUser = { id, order, clientName, price, status}

    const index = request.userIndex

    users[index] = updatedUser

    return response.json(users)
})

app.delete('/order/:id', checkUser, checkMethod, (request, response) => {
    const index = request.userIndex

    users.splice(index, 1)

    return response.status(204).json()
})

app.get('/order/:id', checkUser, checkMethod, (request, response) => {
    const index = request.userIndex

    const userOrder = users[index]

    return response.json(userOrder)
})

app.patch('/order/:id', checkUser, checkMethod, (request, response) => {
    const index = request.userIndex
    
    users[index].status = "Pronto"
 
    return response.json(users[index])
})



app.listen( port, () => {
    console.log`🚗 Server started on port ${port}`
})