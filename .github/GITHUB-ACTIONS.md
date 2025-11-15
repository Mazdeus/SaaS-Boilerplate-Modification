# GitHub Actions Setup for Auto-Deployment

Jika Anda ingin deployment otomatis setiap kali push ke GitHub:

## Setup GitHub Secrets

1. Go to GitHub repository → Settings → Secrets and variables → Actions
2. Add the following secrets:

### AZURE_VM_HOST
```
40.81.26.137
```

### AZURE_VM_USERNAME
```
azureuser
```

### AZURE_VM_SSH_KEY
Generate SSH key dan copy private key:

```bash
# Di komputer lokal
ssh-keygen -t rsa -b 4096 -C "github-actions"

# Copy isi file private key (~/.ssh/id_rsa)
cat ~/.ssh/id_rsa

# Copy public key ke Azure VM
ssh-copy-id azureuser@40.81.26.137
```

Paste isi private key ke GitHub Secret `AZURE_VM_SSH_KEY`

## How It Works

1. Push code ke branch `main` atau `revised`
2. GitHub Actions automatically:
   - Connect ke Azure VM via SSH
   - Pull latest code
   - Rebuild Docker image
   - Restart container
   - Run health check

## Manual Trigger

You can also manually trigger deployment:
- Go to Actions tab
- Select "Deploy to Azure VM"
- Click "Run workflow"

## View Deployment Status

- GitHub repository → Actions
- Click on the latest workflow run
- View logs and status
