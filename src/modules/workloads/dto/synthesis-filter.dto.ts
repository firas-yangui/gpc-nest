import {ApiProperty} from "@nestjs/swagger";

export class SynthesisFilterDto {
    @ApiProperty()
    code: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    domaine: string;

    @ApiProperty()
    thirdparties: number[];

    @ApiProperty()
    portfolios: number[];

    @ApiProperty()
    plans: number[];

    @ApiProperty()
    subnatures: number[];

    @ApiProperty()
    partners: number[];
}
