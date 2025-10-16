import "./infraestructure/config/enviroment.ts";
import app from "./infraestructure/web/app.ts";
import Serverboostrap from "./infraestructure/server/server-boostrap.ts";
import { connectDB } from "./infraestructure/config/Data-base.ts";

const server = new Serverboostrap(app);

(async () => {
  try {
    await connectDB();
    const instances = [server.init()];
    await Promise.all(instances);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
