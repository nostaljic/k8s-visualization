var express = require('express');
const request = require('request');
const { stringify } = require('querystring');
var router = express.Router();

const k8s = require('@kubernetes/client-node');

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
const k8sApi_Expanded = kc.makeApiClient(k8s.NetworkingV1beta1Api)
const opts = {};
const cluster = kc.getCurrentCluster().server;

kc.applyToRequest(opts);


//라우터의 get()함수를 이용해 request URL('/')에 대한 업무처리 로직 정의
router.get('/cluster', function(req, res, next) {
  //raw data, default pod 만 들어온다..
  request.get(`${cluster}/api/v1/namespaces/default/pods`, opts,
    (error, response, body) => {
        if (error) {
            console.log(`error: ${error}`);
        }
        if (response) {
            console.log(`statusCode: ${response.statusCode}`);
        }
        return res.send(JSON.parse(body));
  });
});

router.get('/pod/:name', (req, res) => {
  k8sApi.listNamespacedPod(req.params.name)
    .then((re) => {
      return res.status(200).json(re.body);
    })
    .catch((err) => {
      res.send(err);
    })
});

router.get('/service/:name', (req, res) => {
  k8sApi.listNamespacedService(req.params.name)
    .then((re) => {
      return res.status(200).json(re.body);
    })
    .catch((err) => {
      res.send(err);
    })
});

router.get('/ingress/:name', (req, res) => {
  k8sApi_Expanded.listNamespacedIngress(req.params.name)
    .then((re) => {
      return res.status(200).json(re.body);
    })
    .catch((err) => {
      res.send(err);
    })
});

router.get('/deployment/:name', (req, res) => {
  k8sApi_Expanded.listNamespacedDeployment(req.params.name)
    .then((re) => {
      return res.status(200).json(re.body);
    })
    .catch((err) => {
      res.send(err);
    })
});

router.get('/namespace/:name', (req, res) => {
    k8sApi.readNamespace(req.params.name).then((re)=>{
        return res.status(200).json(re.body);
    })
        .catch((err) => {
        res.send(err);
        })
});

router.get('/namespaces', function(req, res, next) {
    //모든 namespace 호출.
    request.get(`${cluster}/api/v1/namespaces`, opts,
        (error, response, body) => {
            if (error) {
                console.log(`error: ${error}`);
            }
            if (response) {
                console.log(`statusCode: ${response.statusCode}`);
            }
            return res.send(JSON.parse(body));
        });
});

//모듈에 등록해야 web.js에서 app.use 함수를 통해서 사용 가능
module.exports = router;