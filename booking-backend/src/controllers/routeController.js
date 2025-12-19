const routeService = require("../services/routeService");
const handleError = require("../utils/handleError");
const prisma = require("../configs/db");

const RouteController = {
  getAllRoutes: async (req, res) => {
    try {
      const { originProvince, destProvince, code, page, limit } = req.query;
      const result = await routeService.getRoutes(
        originProvince,
        destProvince,
        code,
        page,
        limit,
      );
      res.status(200).json({
        message: "Get routes list successfully",
        ...result,
      });
    } catch (error) {
      handleError(res, error);
    }
  },

  getRouteById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await routeService.getRouteById(id);

      res.status(200).json({
        data: result,
      });
    } catch (error) {
      handleError(res, error);
    }
  },

  registerNewRoute: async (req, res) => {
    try {
      const {
        name,
        fromStationId,
        toStationId,
        durationFromStart,
        distanceFromStart,
        price,
      } = req.body;

      if (!name || !fromStationId || !toStationId) {
        return res.status(400).json({
          message: "Missing required fields",
        });
      }

      const route = await routeService.registerNewRoute({ name });

      // 2. Tạo stop đầu (order = 1)
      await routeService.createNewStop({
        routeId: route.id,
        stationId: fromStationId,
        order: 1,
        durationFromStart: 0,
        distanceFromStart: 0,
        price: 0,
      });

      await routeService.createNewStop({
        routeId: route.id,
        stationId: toStationId,
        order: 2,
        durationFromStart: durationFromStart ?? 0,
        distanceFromStart: distanceFromStart ?? 0,
        price: price ?? 0,
      });

      return res.status(201).json({
        message: "Route created with initial stops",
        data: route,
      });
    } catch (error) {
      handleError(res, error);
    }
  },

  createNewStop: async (req, res) => {
    try {
      const newStop = await routeService.createNewStop(req.body);
      return res.status(201).json({
        message: "New stop for route created successfully",
        data: newStop,
      });
    } catch (error) {
      handleError(res, error);
    }
  },

  updateStop: async (req, res) => {
    try {
      const { stopId } = req.params;
      const updated = await routeService.updateStop(stopId, req.body);
      return res.status(200).json({
        success: true,
        message: "Stop updated successfully",
        data: updated,
      });
    } catch (error) {
      handleError(res, error);
    }
  },

  updateRoute: async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await routeService.updateRoute(id, req.body);
      return res.status(200).json({
        success: true,
        message: "Route updated successfully",
        data: updated,
      });
    } catch (error) {
      handleError(res, error);
    }
  },

  deleteRoute: async (req, res) => {
    try {
      const { id } = req.params;
      await routeService.deleteRoute(id);
      return res.status(200).json({
        success: true,
        message: "Route deleted successfully",
      });
    } catch (error) {
      handleError(res, error);
    }
  },
};

module.exports = RouteController;
