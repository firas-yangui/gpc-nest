import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {thirdparty} from "./thirdparty";
import {subnature} from "./subnature";
import {period} from "./period";


@Entity("sourcingplan" ,{schema:"public" } )
export class sourcingplan {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

    @Column("character varying",{ 
        nullable:false,
        length:3,
        name:"type"
        })
    type:string;
        

    @Column("real",{ 
        nullable:true,
        precision:24,
        name:"value"
        })
    value:number | null;
        

   
    @ManyToOne(()=>thirdparty, (thirdparty: thirdparty)=>thirdparty.sourcingplans,{  })
    @JoinColumn({ name:'childthirdpartyid'})
    childthirdparty:thirdparty | null;


   
    @ManyToOne(()=>thirdparty, (thirdparty: thirdparty)=>thirdparty.sourcingplans2,{  })
    @JoinColumn({ name:'parentthirdpartyid'})
    parentthirdparty:thirdparty | null;


   
    @ManyToOne(()=>subnature, (subnature: subnature)=>subnature.sourcingplans,{  })
    @JoinColumn({ name:'subnatureid'})
    subnature:subnature | null;


   
    @ManyToOne(()=>period, (period: period)=>period.sourcingplans,{  })
    @JoinColumn({ name:'periodid'})
    period:period | null;

}
