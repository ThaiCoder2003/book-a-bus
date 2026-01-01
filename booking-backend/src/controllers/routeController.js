const routeService = require("../services/routeService");
const handleError = require("../utils/handleError");
const prisma = require("../configs/db");
const RouteController = {
  getRoutes: async (req, res) => {
    try {
      const { q } = req.query;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const routes = await routeService.findRoutes(
        q || "",
        page,
        limit,
      );
      res.status(200).json({
        message: "Get routes list successfully",
        routes
      });
    } catch (error) {
      handleError(res, error);
    }
  },

  getRouteById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await routeService.getRouteById(id);

      res.status(200).json(result);
    } catch (error) {
      handleError(res, error);
    }
  },

  registerNewRoute: async (req, res) => {
    try {
      const { name, stops } = req.body;

      if (!name || !Array.isArray(stops) || stops.length < 2) {
        return res.status(400).json({
          message: "Route must have at least 2 stops",
        });
      }
      const result = await prisma.$transaction(async (tx) => {
        routeService.createRouteWithStops(tx, req.body)
      })

        return res.status(201).json({
          message: "Route created successfully",
          data: result,
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
