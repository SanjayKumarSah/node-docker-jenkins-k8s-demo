# Node.js + Docker + Jenkins + Kubernetes Demo

This project is designed for a local Windows + Docker Desktop + WSL2 learning environment.

## Architecture

Developer -> Git -> Jenkins -> Docker build -> Docker Desktop Engine -> Kubernetes -> Node.js pods

## 1. Run locally

```bash
npm install
npm start
```

Open http://localhost:3000

## 2. Run with Docker

```bash
docker build -t node-docker-jenkins-k8s-demo:1.0 .
docker run --rm -p 3000:3000 node-docker-jenkins-k8s-demo:1.0
```

Open http://localhost:3000

## 3. Enable Docker Desktop Kubernetes

Docker Desktop -> Settings -> Kubernetes -> Enable Kubernetes -> Apply & Restart

Verify:

```bash
kubectl get nodes
```

## 4. Deploy manually to Kubernetes

```bash
docker build -t node-docker-jenkins-k8s-demo:1.0 .
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl -n demo get pods
kubectl -n demo get svc
```

Open http://localhost:30080

## 5. Jenkins

Build the custom Jenkins image:

```bash
docker build -f JenkinsDockerfile -t local/jenkins-docker-k8s:1.0 .
```

Run Jenkins with access to the Docker Desktop engine and local Kubernetes config:

```bash
docker volume create jenkins_home

docker run -d \
  --name jenkins \
  --user root \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v $HOME/.kube:/root/.kube \
  -e KUBECONFIG=/root/.kube/config \
  local/jenkins-docker-k8s:1.0
```

Get the initial password:

```bash
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

Open http://localhost:8080

Create a Pipeline job pointing to this repository and use the included Jenkinsfile.

## Notes

- This local lab intentionally uses `imagePullPolicy: Never`, so Kubernetes uses the image built in the Docker Desktop engine.
- For a real CI/CD environment, push versioned images to a registry such as Docker Hub, ECR, or another private registry and use imagePullPolicy: IfNotPresent/Always as appropriate.
- The Jenkins setup above is for learning. In production, do not expose Docker's socket to an untrusted Jenkins instance without understanding the security implications.
