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

# Run devspaces - note issues
devspaces dev

# Delete devspaces
devspaces purge

# Notice lingering pod
kubectl get pod
```
