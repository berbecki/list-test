const Koa = require("koa");
const Router = require("koa-router");
const logger = require("koa-logger");
const json = require("koa-json");
const bodyparser = require("koa-bodyparser");
const cors = require("koa-cors");

const app = new Koa();
const router = new Router();

app.use(json());
app.use(logger());
app.use(bodyparser());
app.use(cors({ origin: "*" }));
app.use(router.routes()).use(router.allowedMethods());

const generateListeners = () => {
  const limit = 10000;
  const listenerName = [
    "bastion_test-0",
    "SekoListenerSSH",
    "!fudo_http_listener",
    "windows8_regular",
    "windows8_forward"
  ];
  const safeName = [
    "testing-1",
    "SekoSejfSSH",
    "http",
    "rdp"
  ];
  const protocols = ["SSH", "HTTP", "RDP"];
  const modes = ["bastion", "proxy"];
  const ips = ["0.0.0.0", "10.0.236.10", "10.0.222.100"];
  const ports = ["1100", "1022", "9999"];
  const reasons = ["", "bo tak!"];

  const generateGUID = () => {
    const S4 = () =>
      (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    return (
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4() +
      S4()
    );
  };

  const getRandomInt = max => Math.floor(Math.random() * Math.floor(max));

  const randomListener = () => listenerName[getRandomInt(listenerName.length)];
  const randomSafe = () => safeName[getRandomInt(safeName.length)];
  const randomProtocol = () => protocols[getRandomInt(protocols.length)];
  const randomMode = () => modes[getRandomInt(modes.length)];
  const randomIp = () => ips[getRandomInt(ips.length)];
  const randomPort = () => ports[getRandomInt(ports.length)];
  const randomReason = () => reasons[getRandomInt(reasons.length)];

  let listeners = [];
  for (let i = 0; i < limit; i++) {
    listeners.push({
      id: generateGUID(),
      name: randomListener(),
      safes: randomSafe(),
      address: randomIp()+':'+randomPort(),
      protocol: randomProtocol(),
      mode: randomMode(),
      blocked: randomReason()
    });
  }
  return listeners;
};

router.get("/", async (ctx, next) => {
  ctx.body = { msg: "Hello from App" };
  await next();
});

router.get("/listeners", async (ctx, next) => {
  ctx.body = { msg: "Hello from Listeners", data: generateListeners() };
  await next();
});

app.listen(3033, '0.0.0.0', () => {
  console.log("App started on http://0.0.0.0:3033");
});
