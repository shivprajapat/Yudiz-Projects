/* eslint-disable camelcase */
const { catchError, removenull, randomStr, getPaginationValues, getUniqueString } = require('../../../helper/utilities.services')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const RoleModel = require('./roles.model')
const RolePermissionModel = require('./role.permission.model')
const ModulePermissionModel = require('./module.permissions.model')
const { Op } = require('sequelize')

class RoleService {
  async getRoleById(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body

      const exist = await RoleModel.findOne({ where: { id, deleted_at: null } })
      if (!exist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].role) })
      const role = await RoleModel.findOne({
        where: {
          [Op.and]: [
            { id },
            { deleted_at: null }
          ]
        },
        include: [{
          model: RolePermissionModel,
          as: 'role_permissions',
          required: false,
          attributes: ['id', 'role_id', 'module_permission_id', 'list', 'view', 'create', 'update', 'delete']
        }],
        attributes: ['id', 'custom_id', 'title', 'is_active']
      })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: role, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].role) })
    } catch (error) {
      return await catchError('school.getAllSchool', error, req, res)
    }
  }

  async getAllRole(req, res) {
    try {
      removenull(req.body)
      const { start, limit, sorting, search } = getPaginationValues(req.body)
      const roles = await RoleModel.findAndCountAll({
        where: {
          [Op.or]: [
            {
              title: {
                [Op.like]: `%${search}%`
              }
            }
          ],
          deleted_at: null
        },
        attributes: ['id', 'title', 'is_active', 'custom_id'],
        order: sorting,
        limit,
        offset: start
      })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: roles, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].role) })
    } catch (error) {
      return await catchError('roles', error, req, res)
    }
  }

  async getAllModule(req, res) {
    try {
      removenull(req.body)
      const modules = await ModulePermissionModel.findAll({
        where: {
          deleted_at: null
        },
        attributes: ['id', 'module_name', 'is_active', 'custom_id', 'list', 'view', 'create', 'update', 'delete']
      })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: modules, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].modules) })
    } catch (error) {
      return await catchError('Modules', error, req, res)
    }
  }

  async createRole(req, res) {
    try {
      removenull(req.body)
      const { title, modules } = req.body

      const sCustomId = randomStr(8, 'string')

      const exist = await RoleModel.findOne({ where: { title, deleted_at: null } })
      if (exist) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].role) })
      const titleExist = await RoleModel.findAll({ raw: true, where: { title, deleted_at: null } })

      if (titleExist.length) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].role) })
      const role = await RoleModel.create({ custom_id: sCustomId, title })
      if (role) {
        /** Add role permissions */
        for (let i = 0; i < modules.length; i++) {
          const module = modules[i]
          const permissions = module.permissions
          const moduleData = {
            custom_id: await getUniqueString(8, RolePermissionModel),
            role_id: role.id,
            module_permission_id: module.module_permission_id,
            list: permissions.list,
            create: permissions.create,
            view: permissions.view,
            update: permissions.update,
            delete: permissions.delete
          }
          await RolePermissionModel.create(moduleData)
        }
        return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: role, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].role) })
      }
    } catch (error) {
      return await catchError('role.create', error, req, res)
    }
  }

  async updateRole(req, res) {
    try {
      const { id, title, isActive, updateType, modules } = req.body
      removenull(req.body)

      const exist = await RoleModel.findOne({ where: { id, deleted_at: null } })
      if (exist) {
        if (updateType && updateType === 'status') {
          await RoleModel.update({ is_active: isActive }, { where: { id: id } })
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].role) })
        } else {
          const titleExist = await RoleModel.findAll({ raw: true, where: { id: { [Op.not]: id }, title, deleted_at: null } })
          if (titleExist.length) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].role) })
          /** Update Role title */
          await RoleModel.update({ title }, { where: { id: id } })

          /** Update role permissions */
          const oldRolePermissions = await RolePermissionModel.findAll({
            raw: true,
            where: {
              role_id: id,
              deleted_at: null
            }
          })
          const oldRolePermissionIds = oldRolePermissions.map((result) => result.id)
          const updatedRolePermissions = []
          for (let i = 0; i < modules.length; i++) {
            const module = modules[i]
            const permissions = module.permissions
            if (module.id) {
              updatedRolePermissions.push(module.id)
              await RolePermissionModel.update({
                module_permission_id: module.module_permission_id,
                list: permissions.list,
                create: permissions.create,
                view: permissions.view,
                update: permissions.update,
                delete: permissions.delete
              }, { where: { id: module.id } })
            } else {
              const moduleData = {
                custom_id: await getUniqueString(8, RolePermissionModel),
                role_id: id,
                module_permission_id: module.module_permission_id,
                list: permissions.list,
                create: permissions.create,
                view: permissions.view,
                update: permissions.update,
                delete: permissions.delete
              }
              await RolePermissionModel.create(moduleData)
            }
          }
          const remainPermissions = oldRolePermissionIds.filter(d => !updatedRolePermissions.includes(d))
          for (let j = 0; j < remainPermissions.length; j++) {
            /** destroy  */
            await RolePermissionModel.destroy({
              where: {
                id: remainPermissions[j]
              }
            })
          }
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].role) })
        }
      } else {
        return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].role) })
      }
    } catch (error) {
      return await catchError('role.update', error, req, res)
    }
  }

  async deleteRole(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body

      const exist = await RoleModel.findOne({ where: { id, deleted_at: null } })
      if (!exist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].role) })

      const role = await RoleModel.update({ deleted_at: new Date() }, { where: { id: id } })
      /** destroy  */
      await RolePermissionModel.destroy({
        where: {
          role_id: id
        }
      })
      if (role) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].role) })
    } catch (error) {
      return await catchError('role.delete', error, req, res)
    }
  }

  async getAllModulesFront(req, res) {
    try {
      const modulePermission = await ModulePermissionModel.findAll({ where: { deleted_at: null, is_active: 'y' } })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: modulePermission, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('modulePermission.getModulePermission', error, req, res)
    }
  }

  async getAllRolesFront(req, res) {
    try {
      const role = await RoleModel.findAll({ where: { deleted_at: null, is_active: 'y' } })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: role, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('role.getRole', error, req, res)
    }
  }
}

module.exports = new RoleService()
