import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {subservice} from "./subservice";
import {serviceappsettings} from "./serviceappsettings";


@Entity("service" ,{schema:"public" } )
@Index("service_code_unique_idx",["code",],{unique:true})
export class service {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

    @Column("text",{ 
        nullable:false,
        name:"code"
        })
    code:string;
        

    @Column("text",{ 
        nullable:false,
        name:"name"
        })
    name:string;
        

    @Column("date",{ 
        nullable:true,
        name:"lastupdatedate"
        })
    lastupdatedate:string | null;
        

    @Column("text",{ 
        nullable:true,
        name:"description"
        })
    description:string | null;
        

   
    @OneToMany(()=>subservice, (subservice: subservice)=>subservice.service,{ onUpdate: 'CASCADE' })
    subservices:subservice[];
    

   
    @OneToMany(()=>serviceappsettings, (serviceappsettings: serviceappsettings)=>serviceappsettings.model)
    serviceappsettingss:serviceappsettings[];
    
}
