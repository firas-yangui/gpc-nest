import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {subservice} from "./subservice";
import {parameter} from "./parameter";


@Entity("stake" ,{schema:"public" } )
export class stake {

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
        

   
    @OneToMany(()=>subservice, (subservice: subservice)=>subservice.stake,{ onDelete: 'SET NULL' , })
    subservices:subservice[];
    

   
    @OneToMany(()=>parameter, (parameter: parameter)=>parameter.stake,{ onDelete: 'SET NULL' , })
    parameters:parameter[];
    
}
