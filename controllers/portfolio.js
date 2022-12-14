const {Equity,Portfolio,Order}=require('../models')
const yahooFinance=require('yahoo-finance')

const createPortfolio=async (req,res)=>{
    try{
        const {name,description,capital}=req.body 
        const portfolio=await Portfolio.create({
            name,
            description,
            capital:10000
        })
        res.status(200).json(portfolio)
    }catch(error){throw error}
}
const readPortfolio=async (req,res)=>{
    try{
        const {pk}=req.params
        const portfolio=await Portfolio.findByPk(pk)
        !portfolio?
        res.status(200).json({alert:`Portfolio with PK: ${pk} not found.`}):
        res.status(200).json(portfolio)
    }catch(error){throw error}
}
const readPortfolioPositions=async (req,res)=>{
    try{
        const {pk}=req.params
        let positions=Object()
        let equity=Object()
        let tkrArray=Array()
        const orders=await Order.findAll({where:{portfolioId:pk}})
        for(let i=0;i<orders.length;i++){
            equity=await Equity.findByPk(orders[i].equityId)
            if(!positions[equity.ticker]){
                tkrArray.push(equity.ticker )
                positions[equity.ticker]={
                    numShares:orders[i].numShares,
                    avgPricePerShare:orders[i].pricePerShare ,
                    currentPrice:0
                }
            }else{
                positions[equity.ticker].avgPricePerShare= 
                    ((positions[equity.ticker].avgPricePerShare*positions[equity.ticker].numShares)+
                    (orders[i].pricePerShare*orders[i].numShares))/(positions[equity.ticker].numShares+orders[i].numShares)
                positions[equity.ticker].numShares+=orders[i].numShares
            }
        }
        const lastCloseObj=await yahooFinance.quote({symbols:tkrArray,modules:['financialData']},(err,quote)=>{})
        for(pos of Object.keys(positions)){
            positions[pos].currentPrice=lastCloseObj[pos].financialData.currentPrice
        }
        res.status(200).json(positions)
    }catch(error){throw error}

}
const updatePortfolio=async (req,res)=>{
    try{
        const {pk}=req.params
        const portfolio=await Portfolio.update({...req.body},{where:{id:pk},returning:true})
        !portfolio?
        res.status(200).json({alert:`Portfolio with PK: ${pk} not found.`}):
        res.status(200).json(portfolio)
    }catch(error){throw error}
}
const deletePortfolio=async (req,res)=>{ 
    try{
        const {pk}=req.params
        const portfolio=await Portfolio.findByPk(pk)
        !portfolio?
        res.status(200).json({alert:`Portfolio with PK: ${pk} not found.`}):
        await Portfolio.destroy({where:{id:pk}})
        res.status(200).json({alert:`Portfolio with PK: ${pk} deleted.`})
    }catch(error){throw error}
}

module.exports={
    createPortfolio,
    readPortfolio,
    updatePortfolio,
    deletePortfolio,
    readPortfolioPositions
}



