# Setting up Istio on a clean GKE cluster (devspaces repro edition)

Note that I have replaced my org name with `<YOUR_PROJECT_HERE>` throughout the codebase; you can search and replace this string.

## Initial Istio setup

```bash
# https://istio.io/latest/docs/setup/install/helm/
kubectl create namespace istio-system
helm install istio-base manifests/charts/base -n istio-system
helm install istiod manifests/charts/istio-control/istio-discovery \
    -n istio-system
helm install istio-ingress manifests/charts/gateways/istio-ingress \
    -n istio-system
kubectl label namespace default istio-injection=enabled

# Install and build app (Node required)
cd app
npm i
npm run docker:build
npm run docker:push
cd ..

# Run devspaces
devspaces dev

# Delete devspaces
devspaces purge

# Get ingress IPs etc.
export INGRESS_HOST=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
export INGRESS_PORT=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.spec.ports[?(@.name=="http2")].port}')
export SECURE_INGRESS_PORT=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.spec.ports[?(@.name=="https")].port}')
export GATEWAY_URL=$INGRESS_HOST:$INGRESS_PORT
echo "http://$GATEWAY_URL/" # visit to see app running
```
