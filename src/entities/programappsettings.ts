import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {program} from "./program";
import {gpcappsettings} from "./gpcappsettings";


@Entity("programappsettings" ,{schema:"public" } )
export class programappsettings {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

   
    @ManyToOne(()=>program, (program: program)=>program.programappsettingss,{  })
    @JoinColumn({ name:'modelid'})
    model:program | null;


   
    @ManyToOne(()=>gpcappsettings, (gpcappsettings: gpcappsettings)=>gpcappsettings.programappsettingss,{  })
    @JoinColumn({ name:'gpcappsettingsid'})
    gpcappsettings:gpcappsettings | null;

}
