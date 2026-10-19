import { Request, Response } from 'express'
import * as storageLocationService from '../services/storage.service'

export const getStorageLocations = async (
  req: Request,
  res: Response
) => {
  try {
    const locations =
      await storageLocationService.getStorageLocations()

    res.json(locations)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to get storage locations'
    })
  }
}

export const getStorageLocationById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params
    const location = await storageLocationService.getStorageLocationById(id as string)
    res.json(location)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to get storage location'
    })
  }
}

export const createStorageLocation = async (
  req: Request,
  res: Response
) => {
  try {
    const data = req.body
    const location = await storageLocationService.createStorageLocation(data)
    res.json(location)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create storage location'
    })
  }
}

export const updateStorageLocation = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params
    const data = req.body
    const location = await storageLocationService.updateStorageLocation(id as string, data)
    res.json(location)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update storage location' 
    })
  }
}

export const deleteStorageLocation = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params
    const location = await storageLocationService.deleteStorageLocation(id as string)
    res.json(location)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete storage location'
    })
  }
}