import { Router } from 'express'
import { authMiddleware } from '../../middlewares/auth.middleware'
import {
  listarTransportes,
  obtenerTransporte,
  crearTransporte,
  actualizarTransporte,
  eliminarTransporte,
  listarTipos,
  listarSubtipos,
} from './transporte.controller'

const router = Router()

router.get('/tipos', authMiddleware, listarTipos)
router.get('/subtipos', authMiddleware, listarSubtipos)
router.get('/', authMiddleware, listarTransportes)
router.get('/:numero_serie', authMiddleware, obtenerTransporte)
router.post('/nuevo', authMiddleware, crearTransporte)
router.put('/:numero_serie', authMiddleware, actualizarTransporte)
router.delete('/:numero_serie', authMiddleware, eliminarTransporte)

export default router
