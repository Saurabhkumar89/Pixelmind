const Replicate = require('replicate');

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Models for different tools
const MODELS = {
  generate: 'stability-ai/stable-diffusion-3',
  removeBg: 'cjwbw/rembg',
  upscale: 'nightmareai/real-esrgan',
  inpaint: 'stability-ai/stable-diffusion-inpainting',
};

/**
 * Generate image from text prompt
 */
async function generateImage(prompt) {
  try {
    console.log('[Replicate] Generating image with prompt:', prompt);
    
    const output = await replicate.run(MODELS.generate, {
      input: {
        prompt,
        negative_prompt: 'blurry, low quality, distorted',
        num_outputs: 1,
        num_inference_steps: 30,
        guidance_scale: 7.5,
      },
    });

    return output[0]; // Returns URL of generated image
  } catch (error) {
    console.error('[Replicate] Generate image error:', error);
    throw new Error('Failed to generate image: ' + error.message);
  }
}

/**
 * Remove background from image
 */
async function removeBackground(imageUrl) {
  try {
    console.log('[Replicate] Removing background from:', imageUrl);
    
    const output = await replicate.run(MODELS.removeBg, {
      input: {
        image: imageUrl,
      },
    });

    return output; // Returns URL of image without background
  } catch (error) {
    console.error('[Replicate] Remove background error:', error);
    throw new Error('Failed to remove background: ' + error.message);
  }
}

/**
 * Upscale image
 */
async function upscaleImage(imageUrl, scale = 4) {
  try {
    console.log('[Replicate] Upscaling image:', imageUrl, 'scale:', scale);
    
    const output = await replicate.run(MODELS.upscale, {
      input: {
        image: imageUrl,
        scale: scale,
      },
    });

    return output; // Returns URL of upscaled image
  } catch (error) {
    console.error('[Replicate] Upscale error:', error);
    throw new Error('Failed to upscale image: ' + error.message);
  }
}

/**
 * Inpainting / Generative Fill
 */
async function generativeFill(imageUrl, maskUrl, prompt) {
  try {
    console.log('[Replicate] Generative fill with prompt:', prompt);
    
    const output = await replicate.run(MODELS.inpaint, {
      input: {
        image: imageUrl,
        mask: maskUrl,
        prompt,
        num_inference_steps: 50,
        guidance_scale: 7.5,
      },
    });

    return output[0]; // Returns URL of inpainted image
  } catch (error) {
    console.error('[Replicate] Generative fill error:', error);
    throw new Error('Failed to apply generative fill: ' + error.message);
  }
}

/**
 * Image expansion (outpainting)
 */
async function expandImage(imageUrl, direction = 'all', expansionAmount = 0.5) {
  try {
    console.log('[Replicate] Expanding image:', imageUrl, 'direction:', direction);
    
    // Using inpainting model with specific prompts for expansion
    // This would typically require preprocessing the image
    const output = await replicate.run(MODELS.inpaint, {
      input: {
        image: imageUrl,
        prompt: `Seamlessly extend the image ${direction}. Maintain consistency in style and content.`,
        num_inference_steps: 50,
        guidance_scale: 7.5,
      },
    });

    return output[0];
  } catch (error) {
    console.error('[Replicate] Expand image error:', error);
    throw new Error('Failed to expand image: ' + error.message);
  }
}

/**
 * AI Background Replacement
 */
async function replaceBackground(imageUrl, backgroundPrompt) {
  try {
    console.log('[Replicate] Replacing background with prompt:', backgroundPrompt);
    
    // First remove background, then inpaint with new background
    const noBg = await removeBackground(imageUrl);
    
    // Then generate new background
    const output = await replicate.run(MODELS.inpaint, {
      input: {
        image: noBg,
        prompt: backgroundPrompt,
        num_inference_steps: 50,
        guidance_scale: 7.5,
      },
    });

    return output[0];
  } catch (error) {
    console.error('[Replicate] Replace background error:', error);
    throw new Error('Failed to replace background: ' + error.message);
  }
}

/**
 * Batch Processing - Generate multiple variations
 */
async function batchGenerate(prompt, count = 3) {
  try {
    console.log('[Replicate] Batch generating', count, 'images with prompt:', prompt);
    
    const outputs = [];
    
    for (let i = 0; i < count; i++) {
      const output = await replicate.run(MODELS.generate, {
        input: {
          prompt,
          negative_prompt: 'blurry, low quality, distorted',
          num_outputs: 1,
          num_inference_steps: 30,
          guidance_scale: 7.5,
          seed: Math.floor(Math.random() * 100000), // Different seed for variation
        },
      });
      
      outputs.push(output[0]);
    }

    return outputs;
  } catch (error) {
    console.error('[Replicate] Batch generate error:', error);
    throw new Error('Failed to batch generate images: ' + error.message);
  }
}

module.exports = {
  generateImage,
  removeBackground,
  upscaleImage,
  generativeFill,
  expandImage,
  replaceBackground,
  batchGenerate,
};
