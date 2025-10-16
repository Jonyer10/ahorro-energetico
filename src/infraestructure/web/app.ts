

import express, { type Request, type Response } from "express";
import userRouter from "../routes/UserRouters.ts"; 
import apartamentsRouter from "../routes/ApartamentsRouters.ts";
import recomendacionesRouter from "../routes/RecomendacionesRouters.ts";
import SolicitudServicio from "../routes/SolicitudServicioRouters.ts";
import ConsumoEnergia   from "../routes/ConsumoEnergiaRouters";


 class App{
    private app: express.Application;

    constructor(){
        this.app = express();
        this.middlewares();
        // Iniciador de rutas
        this.routes();
    }

    private middlewares(): void {
        this.app.use(express.json());
    }

    private routes():void{
        this.app.use("/api", userRouter);
        this.app.use("/api", apartamentsRouter);
        this.app.use("/api", recomendacionesRouter);
        this.app.use("/api", SolicitudServicio);
        this.app.use("/api", ConsumoEnergia);
        
     }


    getApp(){
        return this.app;
    }
 }

 export default new App().getApp();

