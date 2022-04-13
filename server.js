const express = require('express')
const { body, validatorResult, validationResult} = require('express-validator')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())

//Validação de dados simples
app.post('/user', [
    body("username").isEmail(),
    body("password").isLength( {min: 5} )
], (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json( {errors: errors.array()} )
    }
    res.json({msg: "Sucesso"})
})


//Validação de dados com mensagem
app.post('/validator-message', [
    body("username").isEmail().withMessage("Favor inserir um E-mail válido"),
    body("password").isLength( {min: 5} ).withMessage("A senha precisa ter 5 caracteres ou mais")
], (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json( {errors: errors.array()} )
    }
    res.json({msg: "Sucesso"})
})


//Validação de dados Customizada
app.post('/validator-persinalize', [
    body("username").custom(value => {
        //Aqui faz a request para o banco, para ver se existe o e-mail
        if(value == "teste@teste.com"){
            return Promise.reject("E-mail já cadastrado")
        }
    })
], (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json( {errors: errors.array()} )
    }
    res.json({msg: "Sucesso"})
})



//Validação de api de criação de usuários
app.post('/register-user', [
    body("email").isEmail().withMessage("Favor inserir um e-mail válido"),
    body("email").custom(value => {
        //Não precisa necessariamente dessa validação, estou usando apenas para retornar a mensagem e deixar mais bonito
        if(!value){
            return Promise.reject("O e-mail é obrigatório!")
        }
        if(value == "teste@teste.com"){
            return Promise.reject("E-mail já cadastrado")
        }
        return true
    }),
    body("name").isLength({min: 3}).withMessage("Nome precisa ter no mínimo 3 caracteres"),
    body("password").isLength({min: 6}).withMessage("Senha precisa ter no mínimo 6 caracteres"),
    body("age").isNumeric().withMessage("Idade precisa ser um número")
], (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json( {errors: errors.array()} )
    }
    res.json({msg: "Sucesso"})
})



app.listen(3000, () => {
    console.log('Rodando na porta 3000')
})