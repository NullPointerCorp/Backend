import { Request, Response } from 'express'
import * as service from './transporte.service'

export const listarTransportes = async (req: Request, res: Response) => {
  try {
    const transportes = await service.listarTransportes()
    res.json(transportes)
  } catch (error) {
    res.status(500).json({ message: 'Error al listar transportes' })
  }
}

export const obtenerTransporte = async (req: Request, res: Response) => {
  try {
    const transporte = await service.obtenerTransporte(String(req.params.numero_serie))
    res.json(transporte)
  } catch (error: any) {
    if (error.message === 'Transporte no encontrado') {
      return res.status(404).json({ message: error.message })
    }
    res.status(500).json({ message: 'Error interno' })
  }
}

export const crearTransporte = async (req: Request, res: Response) => {
  try {
    const nuevoTransporte = await service.crearTransporte(req.body)
    res.status(201).json(nuevoTransporte)
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error al crear transporte' })
  }
}

export const actualizarTransporte = async (req: Request, res: Response) => {
  try {
    const transporte = await service.actualizarTransporte(String(req.params.numero_serie), req.body)
    res.json(transporte)
  } catch (error: any) {
    if (error.message === 'Transporte no encontrado') {
      return res.status(404).json({ message: error.message })
    }
    res.status(500).json({ message: 'Error interno' })
  }
}

export const eliminarTransporte = async (req: Request, res: Response) => {
  try {
    await service.eliminarTransporte(String(req.params.numero_serie))
    res.json({ message: 'Transporte eliminado correctamente' })
  } catch (error: any) {
    if (error.message === 'No se puede eliminar el transporte porque tiene registros asociados') {
      return res.status(409).json({ message: error.message })
    }
    res.status(404).json({ message: 'Transporte no encontrado' })
  }
}

export const listarTipos = async (req: Request, res: Response) => {
  try {
    const tipos = await service.listarTipos()
    res.json(tipos)
  } catch (error) {
    res.status(500).json({ message: 'Error al listar tipos de transporte' })
  }
}

export const listarSubtipos = async (req: Request, res: Response) => {
  try {
    const subtipos = await service.listarSubtipos()
    res.json(subtipos)
  } catch (error) {
    res.status(500).json({ message: 'Error al listar subtipos de transporte' })
  }
}