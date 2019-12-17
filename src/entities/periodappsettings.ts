import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {period} from "./period";
import {gpcappsettings} from "./gpcappsettings";


@Entity("periodappsettings" ,{schema:"public" } )
@Index("unique_period_gpcappsettings_couple",["gpcappsettings","model",],{unique:true})
export class periodappsettings {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

   
    @ManyToOne(()=>period, (period: period)=>period.periodappsettingss,{  })
    @JoinColumn({ name:'modelid'})
    model:period | null;


   
    @ManyToOne(()=>gpcappsettings, (gpcappsettings: gpcappsettings)=>gpcappsettings.periodappsettingss,{  })
    @JoinColumn({ name:'gpcappsettingsid'})
    gpcappsettings:gpcappsettings | null;


    @Column("boolean",{ 
        nullable:false,
        default: () => "false",
        name:"iscampaignperiod"
        })
    iscampaignperiod:boolean;
        

    @Column("character varying",{ 
        nullable:true,
        length:128,
        default: () => "'administratorOnly'",
        name:"status"
        })
    status:string | null;
        
}
