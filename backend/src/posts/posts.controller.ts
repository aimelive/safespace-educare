import {
  Controller,
  Get,
  Post,
  Body,
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
  ApiParam,
} from "@nestjs/swagger";
import { PostsService } from "./posts.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { JwtPayload } from "../common/types";

@ApiTags("posts")
@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // ── Public ────────────────────────────────────────────────────────────────

  @Get()
  @ApiOperation({ summary: "Get all published community posts" })
  @ApiResponse({
    status: 200,
    description: "List of published posts with author names.",
  })
  getAll() {
    return this.postsService.getAll();
  }

  // ── Protected ─────────────────────────────────────────────────────────────

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT")
  @ApiOperation({ summary: "Create a new community post" })
  @ApiResponse({ status: 201, description: "Post created." })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  create(@Body() dto: CreatePostDto, @CurrentUser() user: JwtPayload) {
    return this.postsService.create(dto, user.id);
  }

  @Post(":id/like")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Like a post (idempotent)" })
  @ApiParam({ name: "id", description: "Post UUID" })
  @ApiResponse({
    status: 200,
    description: "Updated like count.",
    schema: { example: { likes: 42 } },
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  like(@Param("id") id: string, @CurrentUser() user: JwtPayload) {
    return this.postsService.like(id, user.id);
  }
}
