import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {phase} from "./phase";
import {gpcappsettings} from "./gpcappsettings";


@Entity("phaseappsettings" ,{schema:"public" } )
@Index("unique_phase_gpcappsettings_couple",["gpcappsettings","model",],{unique:true})
export class phaseappsettings {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

   
    @ManyToOne(()=>phase, (phase: phase)=>phase.phaseappsettingss,{  })
    @JoinColumn({ name:'modelid'})
    model:phase | null;


   
    @ManyToOne(()=>gpcappsettings, (gpcappsettings: gpcappsettings)=>gpcappsettings.phaseappsettingss,{  })
    @JoinColumn({ name:'gpcappsettingsid'})
    gpcappsettings:gpcappsettings | null;


    @Column("integer",{ 
        nullable:true,
        name:"phaseorder"
        })
    phaseorder:number | null;
        
}
