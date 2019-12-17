import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {subservice} from "./subservice";
import {programappsettings} from "./programappsettings";


@Entity("program" ,{schema:"public" } )
@Index("program_code_unique_idx",["code",],{unique:true})
@Index("program_name_unique_idx",["name",],{unique:true})
export class program {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

    @Column("character varying",{ 
        nullable:false,
        unique: true,
        length:32,
        name:"name"
        })
    name:string;
        

    @Column("character varying",{ 
        nullable:false,
        unique: true,
        length:32,
        name:"code"
        })
    code:string;
        

   
    @OneToMany(()=>subservice, (subservice: subservice)=>subservice.program)
    subservices:subservice[];
    

   
    @OneToMany(()=>programappsettings, (programappsettings: programappsettings)=>programappsettings.model)
    programappsettingss:programappsettings[];
    
}
