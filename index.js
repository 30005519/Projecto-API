const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require ('cheerio')
const {response} = require('express')
const app = express()

const newspapers = [
    {
        name: 'Ponto de Situação Actual em Portugal',
        adress: 'https://covid19.min-saude.pt/ponto-de-situacao-atual-em-portugal/',
        base: 'https://covid19.min-saude.pt'
    },
    {
        name: 'Em caso de isolamento',
        adress: 'https://covid19.min-saude.pt/wp-content/uploads/2020/03/Folheto-isolamento.pdf',
        base: 'https://covid19.min-saude.pt'
    },
    {
        name: 'FAQs',
        adress: 'https://covid19.min-saude.pt/category/perguntas-frequentes/',
        base: 'https://covid19.min-saude.pt'
    },
    {
        name: 'Sapo',
        adress: 'https://www.sapo.pt/noticias/covid19/',
        base: 'https://www.sapo.pt/noticias/covid19'
    },
    {
        name: 'Público',
        adress: 'https://www.publico.pt/2021/11/13/sociedade/noticia',
        base: 'https://www.publico.pt'
    },
    {
        name: 'DN',
        adress: 'https://www.dn.pt/tag/coronavirus.html',
        base: 'https://www.dn.pt'
    },
]

const articles =[]

newspapers.forEach(newspaper => {
    axios.get(newspaper.adress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            
            $('a:contains("COVID-19")', html).each(function (){
                const tittle = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    tittle,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
                
        })    

    })
})

app.get('/', (req, res) => {

    res.json("Bem vindos à API COVID-19")   
})

app.get('/news', (req, res) => {

    res.json(articles)

})

app.get('/news/:newspaperId',(req, res)=>{
    const newspaperId = req.params.newspaperId

    const newspaperAdress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].adress
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

    axios.get(newspaperAdress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("COVID-19")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr ('href')
                specificArticles.push({
                    tittle,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))

})
app.listen(PORT, () => console.log(`O servidor está a correr na PORT ${PORT}`))
