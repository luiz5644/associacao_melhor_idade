import mysql from 'mysql2/promise'

export const conexao = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'12345678',
    database:'associacao_melhor_idade'
})