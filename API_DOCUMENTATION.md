# Documentação da API - Cinedestino

Este documento descreve todas as rotas de API disponíveis no backend Next.js.

## Base URL

Todas as rotas estão disponíveis em `/api/`

## Estrutura de Resposta

Todas as rotas retornam JSON no seguinte formato:

```json
{
  "success": true | false,
  "message": "Mensagem opcional",
  "data": { /* dados opcionais */ },
  "error": "Mensagem de erro (apenas quando success: false)"
}
```

## Autenticação

A autenticação é feita via cookie `token_login` (httpOnly, secure, SameSite=Lax). O token é gerado no login e armazenado no banco de dados na tabela `usuarios`, campo `token_login`.

---

## Rotas de Autenticação

### POST /api/auth/register

Registra um novo usuário.

**Request Body:**
```json
{
  "nome": "Nome Completo",
  "email": "email@exemplo.com",
  "senha": "senha123"
}
```

**Resposta de Sucesso (201):**
```json
{
  "success": true,
  "message": "Conta criada com sucesso",
  "data": {
    "id": 1,
    "token_cadastro": "token-gerado-para-upload-foto"
  }
}
```

**Resposta de Erro (400):**
```json
{
  "success": false,
  "error": "Email já cadastrado"
}
```

---

### POST /api/auth/login

Realiza login do usuário e define cookie de autenticação.

**Request Body:**
```json
{
  "email": "email@exemplo.com",
  "senha": "senha123"
}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "id": 1
  }
}
```

**Cookie:** `token_login` é definido automaticamente (httpOnly, secure, SameSite=Lax, expira em 24h)

**Resposta de Erro (401):**
```json
{
  "success": false,
  "error": "Email ou senha incorretos"
}
```

---

### POST /api/auth/logout

Realiza logout do usuário, removendo o token do banco e limpando o cookie.

**Autenticação:** Requerida (cookie `token_login`)

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Logout realizado com sucesso"
}
```

**Resposta de Erro (401):**
```json
{
  "success": false,
  "error": "Não autenticado"
}
```

---

## Rotas de Upload

### POST /api/upload/photo

Upload de foto de perfil para usuário autenticado.

**Autenticação:** Requerida (cookie `token_login`)

**Request:** `multipart/form-data`
- Campo: `foto_perfil` (File)
- Formatos aceitos: JPG, JPEG, PNG
- Tamanho máximo: 5MB

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Foto salva com sucesso",
  "data": {
    "foto_perfil": "https://supabase.co/storage/v1/object/public/fotos-perfil/usuarios/arquivo.jpg"
  }
}
```

**Resposta de Erro (400):**
```json
{
  "success": false,
  "error": "Formato inválido. Use JPG ou PNG"
}
```

---

### POST /api/upload/photo-register

Upload de foto de perfil durante o cadastro (usa token_cadastro).

**Query Parameters:**
- `token` (obrigatório): Token de cadastro retornado no registro

**Request:** `multipart/form-data`
- Campo: `foto_perfil` (File)
- Formatos aceitos: JPG, JPEG, PNG
- Tamanho máximo: 5MB

**Exemplo de URL:**
```
POST /api/upload/photo-register?token=abc123def456
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Foto salva com sucesso",
  "data": {
    "foto_perfil": "https://supabase.co/storage/v1/object/public/fotos-perfil/usuarios/arquivo.jpg"
  }
}
```

**Resposta de Erro (401):**
```json
{
  "success": false,
  "error": "Token inválido ou expirado"
}
```

---

## Rotas de Perfil

### GET /api/profile/me

Retorna os dados do usuário autenticado.

**Autenticação:** Requerida (cookie `token_login`)

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nome": "Nome Completo",
    "email": "email@exemplo.com",
    "foto_perfil": "https://supabase.co/storage/v1/object/public/fotos-perfil/usuarios/arquivo.jpg"
  }
}
```

**Resposta de Erro (401):**
```json
{
  "success": false,
  "error": "Não autenticado"
}
```

---

## Códigos de Status HTTP

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Erro de validação/requisição inválida
- `401` - Não autenticado
- `500` - Erro interno do servidor

---

## Variáveis de Ambiente Necessárias

Certifique-se de configurar as seguintes variáveis no arquivo `.env`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
```

---

## Exemplo de Uso no Frontend

### Login
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'usuario@exemplo.com',
    senha: 'senha123'
  })
});

const data = await response.json();
if (data.success) {
  // Cookie é definido automaticamente
  console.log('Login realizado!');
}
```

### Upload de Foto
```javascript
const formData = new FormData();
formData.append('foto_perfil', fileInput.files[0]);

const response = await fetch('/api/upload/photo', {
  method: 'POST',
  body: formData
});

const data = await response.json();
if (data.success) {
  console.log('Foto salva:', data.data.foto_perfil);
}
```

### Verificar Usuário Logado
```javascript
const response = await fetch('/api/profile/me');
const data = await response.json();

if (data.success) {
  console.log('Usuário:', data.data);
} else {
  console.log('Não autenticado');
}
```
