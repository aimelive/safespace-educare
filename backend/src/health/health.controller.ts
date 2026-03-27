import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

@ApiTags("health")
@Controller("health")
export class HealthController {
  @Get()
  @ApiOperation({ summary: "Server health check" })
  @ApiResponse({
    status: 200,
    description: "Server is up.",
    schema: {
      example: {
        status: "ok",
        message: "SafeSpace Educare Backend is running",
      },
    },
  })
  check() {
    return { status: "ok", message: "SafeSpace Educare Backend is running" };
  }
}
