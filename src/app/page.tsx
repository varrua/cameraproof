'use client'
import Image from 'next/image'
import styles from './page.module.css'
import Camera from './camera'
import { useEffect, useState } from 'react'
import { Box, Button } from '@mui/material'
import  platform  from 'platform'


export default function Home() {

  const [abrirCamara, setabrirCamara] = useState(false)
  const [sistemaOperativo, setsistemaOperativo] = useState('')
  const [datosImagen, setdatosImagen] = useState('')

  const detectarSistemaOperativo = () => {
    setsistemaOperativo(platform.os?.family?.toLowerCase() as string)
  }

  useEffect(() => {
    detectarSistemaOperativo()
  }, [])
  

  return (
    <Box>

      <Button onClick={()=>setabrirCamara(!abrirCamara)}>
        abrir camara {sistemaOperativo}
      </Button>
      <Button onClick={()=>setdatosImagen('')}>
        limpiar camara
      </Button>
      {abrirCamara && 
        <Camera setDatosImagen={setdatosImagen}/>
      }
      {datosImagen !== '' &&
       <img src={datosImagen} alt='capturada'/>
      }
    </Box>
        
  )
}
