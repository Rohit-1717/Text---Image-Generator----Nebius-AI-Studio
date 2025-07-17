# 🧠 Text to Image Generator using Nebius AI

Transform your ideas into stunning visuals using **Nebius AI Studio**'s state-of-the-art diffusion model **FLUX.1-dev by Black Forest Labs**. This app allows you to input a textual description and receive high-quality AI-generated images in return.

---

## ✨ Demo Output

| Prompt | Generated Image |
|--------|-----------------|
| `A cat cycling on mars.` | ![Cyberpunk](https://res.cloudinary.com/rohitcloudinary/image/upload/v1752785432/Text_Img_Generation/text2img-ca72df70-8d1b-4998-81d5-bec3bc95999c_00001__hqh4fc.png) |
| `A dog eating hot-dog.` | ![Astronaut](https://res.cloudinary.com/rohitcloudinary/image/upload/v1752785432/Text_Img_Generation/text2img-bc4b58d3-8263-4ae8-954f-f370a513b260_00001__j5ggp2.png) |



> ⚠️ NSFW or adult prompts are blocked for safety using a guardrail prompt-checker layer.

---

## 🧠 Model Information

- **Model**: `FLUX.1-dev`
- **Provider**: Nebius AI Studio
- **Creator**: Black Forest Labs
- **Image Output Type**: PNG
- **Resolution**: 1024x1024 px

### 💰 Pricing

| Type | Price per image |
|------|-----------------|
| Default | $0.007 |
| With LoRA | $0.02 |

---

## ⏱️ Rate Limits

| Model | Requests per minute |
|-------|---------------------|
| black-forest-labs/flux-schnell | 100 RPM |

---

## 💻 Tech Stack

- **Frontend**: ReactJs, TailwindCSS
- **Backend**: Node.js, Express.js
- **Image Generation**: Nebius AI SDK
- **Security**: NSFW/Obscene prompt filtering using OpenAI embeddings

---

## 🚀 Features

- 🌐 Modern UI with responsive design for all screen sizes
- ✨ Real-time AI-powered image generation
- 🛡️ Guardrails to block NSFW/obscene content
- 📦 Image output in `URL` format
- 📜 Prompt appears below the image for context

---

## 🔮 Future Advancements

- 🎯 Fine-Tuning capability to personalize image styles
- 🛡️ Advanced safety guardrails using vector embeddings
- 💳 Integration of secure payment gateways for premium access

---

## 👤 Author

**Rohit Vishwakarma**

> _Empowering imagination through AI._

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

