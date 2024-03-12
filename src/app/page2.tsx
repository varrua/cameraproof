'use client'
import styles from './page.module.css'
import Camera from './camera'
import { useEffect, useState } from 'react'
import { Box, Button } from '@mui/material'
import  platform  from 'platform'
import { OEM, createWorker } from "tesseract.js";


export default function Home() {

  const [abrirCamara, setabrirCamara] = useState(false)
  const [sistemaOperativo, setsistemaOperativo] = useState('')
  const [datosImagen, setdatosImagen] = useState('')
  const [texto, setTexto] = useState('')

  const [brightness, setBrightness] = useState(5);
  const [contrast, setContrast] = useState(5);


  const detectarSistemaOperativo = () => {
    setsistemaOperativo(platform.os?.family?.toLowerCase() as string)
  }

  useEffect(() => {
    detectarSistemaOperativo()
  }, [])

  async function detectText(image:any) {
    // Crear un trabajador de tesseract.js
    //const worker =  await createWorker();
    const worker = await createWorker('spa')
    const { data: { text } } = await worker.recognize(image);
    await worker.terminate();
    setTexto(text)
    console.log('texto',text)
  
    // Devolver el texto reconocido
    return text;
  }


  const handleApplyFilters = () => {
    // Aplica los ajustes de brillo y contraste a la imagen
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = datosImagen;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if(ctx){
        console.log(brightness)
        console.log(contrast)
        ctx.filter = `brightness(${brightness}) contrast(${contrast})`;
        ctx.drawImage(img, 0, 0);
        const modifiedImageSrc = canvas.toDataURL('image/jpeg');
        // Envía la imagen modificada al servidor o haz algo con ella
        setdatosImagen(modifiedImageSrc)
        console.log(modifiedImageSrc);
        detectText(modifiedImageSrc)

      }
    };
  };
  

  return (
    <Box>

      <Button onClick={()=>setabrirCamara(!abrirCamara)}>
        abrir camara {sistemaOperativo}
      </Button>
      <Button onClick={()=>setdatosImagen('')}>
        limpiar camara  {texto}
      </Button>
      {abrirCamara && 
        <Camera setDatosImagen={setdatosImagen} imagen={datosImagen}/>
      }
      {datosImagen !== '' &&
       <img src={datosImagen} alt='capturada'/>
      }
      


{/* <input
        type="range"
        min="0"
        max="2"
        step="0.1"
        value={brightness}
        onChange={(e) => setBrightness(parseInt(e.target.value))}
      />
      <input
        type="range"
        min="0"
        max="2"
        step="0.1"
        value={contrast}
        onChange={(e) => setContrast(parseInt(e.target.value))}
      /> */}
      <Button onClick={()=>setBrightness(brightness-1)}>
          bajar brillo {brightness}
      </Button>
      <Button onClick={()=>setBrightness(brightness+1)}>
          subir brillo
      </Button>
      <Button onClick={()=>setContrast(contrast-1)}>
          bajar contraste {contrast}
      </Button>
      <Button onClick={()=>setContrast(contrast+1)}>
          subir contraste
      </Button>
      
      <button onClick={handleApplyFilters}>Aplicar Filtros</button>
    </Box>
        
  )
}
