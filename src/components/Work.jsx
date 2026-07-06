import { projects } from '../data/projects'
import Scene from './Scene'
import ProjectBlock from './ProjectBlock'

export default function Work() {
  const visible = projects.filter((p) => !p.hidden)
  return (
    <>
      {visible.map((project) => (
        <Scene key={project.id} id={project.id} tint={project.tint}>
          <ProjectBlock project={project} />
        </Scene>
      ))}
    </>
  )
}
