import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Query,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from "@nestjs/swagger";
import { ResourcesService } from "./resources.service";
import { SaveResourceDto } from "./dto/save-resource.dto";
import { CreateResourceDto } from "./dto/create-resource.dto";
import { UpdateResourceDto } from "./dto/update-resource.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { JwtPayload } from "../common/types";
import { PaginationQueryDto } from "../common/dto/pagination-query.dto";

@ApiTags("resources")
@Controller("resources")
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  // ── Public ────────────────────────────────────────────────────────────────

  @Get()
  @ApiOperation({ summary: "Browse all active resources, optionally filtered by category" })
  @ApiQuery({ name: "category", required: false, type: String, example: "anxiety" })
  @ApiQuery({ name: "page",     required: false, type: Number, example: 1 })
  @ApiQuery({ name: "limit",    required: false, type: Number, example: 20 })
  @ApiResponse({ status: 200, description: "List of active resources." })
  getAll(
    @Query("category") category?: string,
    @Query() pagination?: PaginationQueryDto,
  ) {
    return this.resourcesService.getAll(category, pagination);
  }

  // ── Admin CRUD ────────────────────────────────────────────────────────────
  // Declared before /:id routes so "admin" is not mistaken for a UUID param.

  @Get("admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBearerAuth("JWT")
  @ApiOperation({ summary: "List ALL resources including inactive ones (admin only)" })
  @ApiResponse({ status: 200, description: "All resources." })
  @ApiResponse({ status: 403, description: "Forbidden." })
  getAllAdmin() {
    return this.resourcesService.getAllAdmin();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBearerAuth("JWT")
  @ApiOperation({ summary: "Create a new resource (admin only)" })
  @ApiResponse({ status: 201, description: "Resource created." })
  @ApiResponse({ status: 403, description: "Forbidden." })
  create(@Body() dto: CreateResourceDto) {
    return this.resourcesService.create(dto);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBearerAuth("JWT")
  @ApiOperation({ summary: "Update a resource (admin only)" })
  @ApiParam({ name: "id", description: "Resource UUID" })
  @ApiResponse({ status: 200, description: "Updated resource." })
  @ApiResponse({ status: 404, description: "Resource not found." })
  update(@Param("id") id: string, @Body() dto: UpdateResourceDto) {
    return this.resourcesService.update(id, dto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBearerAuth("JWT")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete a resource (admin only)" })
  @ApiParam({ name: "id", description: "Resource UUID" })
  @ApiResponse({ status: 200, description: "Resource deleted." })
  @ApiResponse({ status: 404, description: "Resource not found." })
  remove(@Param("id") id: string) {
    return this.resourcesService.remove(id);
  }

  // ── Student saved resources ───────────────────────────────────────────────

  @Post("save")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT")
  @ApiOperation({ summary: "Save a resource to the current user's library" })
  @ApiResponse({ status: 201, description: "Resource saved." })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  save(@Body() dto: SaveResourceDto, @CurrentUser() user: JwtPayload) {
    return this.resourcesService.save(dto, user.id);
  }

  @Get("saved")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT")
  @ApiOperation({ summary: "Get the current user's saved resources" })
  @ApiResponse({ status: 200, description: "Saved resources list." })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  getSaved(@CurrentUser() user: JwtPayload) {
    return this.resourcesService.getSaved(user.id);
  }
}
