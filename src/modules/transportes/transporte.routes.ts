import { Router } from 'express'
import { authMiddleware } from '../../middlewares/auth.middleware'
import {
  listarTransportesSucursal,
  listarTransportes,
  obtenerTransporte,
  crearTransporte,
  actualizarTransporte,
  eliminarTransporte,
  listarTipos,
  listarSubtipos,
} from './transporte.controller'

const router = Router()

router.get("/empleado/:empleado_id", authMiddleware, listarTransportesSucursal);
router.get('/', authMiddleware, listarTransportes)
router.get('/tipos', authMiddleware, listarTipos)
router.get('/subtipos', authMiddleware, listarSubtipos)
router.get('/:numero_serie', authMiddleware, obtenerTransporte)
router.post('/nuevo', authMiddleware, crearTransporte)
router.put('/:numero_serie', authMiddleware, actualizarTransporte)
router.delete('/:numero_serie', authMiddleware, eliminarTransporte)

export default router
