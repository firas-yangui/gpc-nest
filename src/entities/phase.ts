import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {projectreporting} from "./projectreporting";
import {parameter} from "./parameter";
import {subservice} from "./subservice";
import {phaseappsettings} from "./phaseappsettings";


@Entity("phase" ,{schema:"public" } )
export class phase {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

    @Column("text",{ 
        nullable:true,
        name:"englishname"
        })
    englishname:string | null;
        

    @Column("text",{ 
        nullable:true,
        name:"frenchname"
        })
    frenchname:string | null;
        

   
    @OneToMany(()=>projectreporting, (projectreporting: projectreporting)=>projectreporting.phase)
    projectreportings:projectreporting[];
    

   
    @OneToMany(()=>parameter, (parameter: parameter)=>parameter.phase)
    parameters:parameter[];
    

   
    @OneToMany(()=>subservice, (subservice: subservice)=>subservice.phase)
    subservices:subservice[];
    

   
    @OneToMany(()=>phaseappsettings, (phaseappsettings: phaseappsettings)=>phaseappsettings.model)
    phaseappsettingss:phaseappsettings[];
    
}
